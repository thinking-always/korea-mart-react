from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import os, json

app = Flask(__name__)
CORS(app)

DATA_FILE = 'products.json'
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'images')
BANNER_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'banners')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# 폴더 자동 생성
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(BANNER_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['BANNER_FOLDER'] = BANNER_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ 포스터 업로드 + 리사이징
from PIL import ImageOps  # 추가

@app.route('/api/upload-banner', methods=['POST'])
def upload_banner():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(BANNER_FOLDER, filename)

        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(save_path):
            filename = f"{base}_{counter}{ext}"
            save_path = os.path.join(BANNER_FOLDER, filename)
            counter += 1

        # ✅ 이미지 로딩 및 리사이징 (중앙 crop 후 resize)
        image = Image.open(file)
        image = ImageOps.fit(image, (1200, 600), Image.LANCZOS, centering=(0.5, 0.5))  # ← 여기 중요
        image.save(save_path)

        return jsonify({'imageUrl': f'/static/banners/{filename}'})

    return jsonify({'error': 'Invalid file type'}), 400


# ✅ 포스터 목록 조회
@app.route('/api/banners', methods=['GET'])
def get_banners():
    try:
        os.makedirs(BANNER_FOLDER, exist_ok=True)
        files = os.listdir(BANNER_FOLDER)
        urls = [f"/static/banners/{f}" for f in files if allowed_file(f)]
        return jsonify(urls)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ✅ 포스터 삭제
@app.route('/api/delete-banner', methods=['POST'])
def delete_banner():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    try:
        file_path = os.path.join(BANNER_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'message': 'Deleted'}), 200
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ 상품 전체 불러오기
@app.route('/api/products', methods=['GET'])
def get_products():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r') as f:
        return jsonify(json.load(f))

# ✅ 상품 추가
@app.route('/api/products', methods=['POST'])
def add_product():
    new_product = request.get_json()
    if not os.path.exists(DATA_FILE):
        products = []
    else:
        with open(DATA_FILE, 'r') as f:
            products = json.load(f)

    new_product['id'] = int(__import__('time').time() * 1000)
    products.append(new_product)

    with open(DATA_FILE, 'w') as f:
        json.dump(products, f)

    return jsonify(new_product), 201

# ✅ 상품 삭제
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if not os.path.exists(DATA_FILE):
        return '', 204
    with open(DATA_FILE, 'r') as f:
        products = json.load(f)
    products = [p for p in products if p['id'] != product_id]
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f)
    return '', 204

# ✅ 상품 수정
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    updated_data = request.get_json()
    if not os.path.exists(DATA_FILE):
        return jsonify({'error': 'Product not found'}), 404
    with open(DATA_FILE, 'r') as f:
        products = json.load(f)

    updated = None
    for product in products:
        if product['id'] == product_id:
            product.update(updated_data)
            updated = product
            break

    if updated is None:
        return jsonify({'error': 'Product not found'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(products, f)

    return jsonify(updated)

# ✅ 상품 이미지 업로드
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        save_path = os.path.join(UPLOAD_FOLDER, filename)

        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(save_path):
            filename = f"{base}_{counter}{ext}"
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            counter += 1

        file.save(save_path)
        return jsonify({'imageUrl': f'/static/images/{filename}'})

    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
