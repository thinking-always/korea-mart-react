from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image, ImageOps
import os, json

# ✅ 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'images')
BANNER_FOLDER = os.path.join(BASE_DIR, 'static', 'banners')
BUILD_FOLDER = os.path.join(BASE_DIR, 'build')  # React build 폴더

app = Flask(__name__, static_folder=BUILD_FOLDER, static_url_path='')
CORS(app, origins=["https://korea-mart-react-3.onrender.com"])


DATA_FILE = os.path.join(BASE_DIR, 'products.json')
PROMO_CARDS_FILE = os.path.join(BASE_DIR, 'promo_cards.json')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(BANNER_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['BANNER_FOLDER'] = BANNER_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ 포스터 업로드 + 중앙 Crop 리사이징
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

        image = Image.open(file)
        image = ImageOps.fit(image, (1200, 600), Image.LANCZOS, centering=(0.5, 0.5))
        image.save(save_path)

        return jsonify({
            'imageUrl': f'/static/banners/{filename}',
            'filename': filename
        })

    return jsonify({'error': 'Invalid file type'}), 400

# ✅ 포스터 리스트 불러오기
@app.route('/api/banners', methods=['GET'])
def get_banners():
    files = os.listdir(BANNER_FOLDER)
    banners = [
        {
            'filename': f,
            'url': f"/static/banners/{f}"
        }
        for f in files if allowed_file(f)
    ]
    return jsonify(banners)

# ✅ 포스터 삭제
@app.route('/api/delete-banner', methods=['POST'])
def delete_banner():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    path = os.path.join(BANNER_FOLDER, filename)
    if os.path.exists(path):
        os.remove(path)
        return jsonify({'message': 'Deleted'}), 200
    return jsonify({'error': 'File not found'}), 404

# ✅ 상품 데이터
@app.route('/api/products', methods=['GET'])
def get_products():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r') as f:
        return jsonify(json.load(f))

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

# ✅ 프로모 카드
@app.route('/api/promo-cards', methods=['GET'])
def get_promo_cards():
    if not os.path.exists(PROMO_CARDS_FILE):
        return jsonify([])
    with open(PROMO_CARDS_FILE, 'r') as f:
        return jsonify(json.load(f))

@app.route('/api/promo-cards', methods=['PUT'])
def save_promo_cards():
    cards = request.get_json()
    with open(PROMO_CARDS_FILE, 'w') as f:
        json.dump(cards, f)
    return jsonify({'message': 'Promo cards saved successfully.'}), 200

# ✅ 업로드 이미지 제공
@app.route('/static/images/<filename>')
def serve_uploaded_images(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ✅ 배너 이미지 제공
@app.route('/static/banners/<filename>')
def serve_banner_image(filename):
    return send_from_directory(app.config['BANNER_FOLDER'], filename)

# ✅ React SPA 라우팅 처리 (마지막에 위치해야 함)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# ✅ 실행
# if __name__ == '__main__':
#     app.run(debug=True)
