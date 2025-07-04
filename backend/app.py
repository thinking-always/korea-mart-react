from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os, json, cloudinary, cloudinary.uploader
from dotenv import load_dotenv

# ✅ .env 로드
load_dotenv()

# ✅ Cloudinary 설정
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# ✅ 경로 상수
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_FOLDER = os.path.join(BASE_DIR, 'build')
DATA_FILE = os.path.join(BASE_DIR, 'products.json')
PROMO_CARDS_FILE = os.path.join(BASE_DIR, 'promo_cards.json')
BANNERS_FILE = os.path.join(BASE_DIR, 'banners.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# ✅ Flask 인스턴스 + CORS
app = Flask(__name__, static_folder=BUILD_FOLDER, static_url_path='')
CORS(app, origins="*")

# ✅ 파일 확장자 검사
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ 상품 CRUD
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

# ✅ promo-cards GET
@app.route('/api/promo-cards', methods=['GET'])
def get_promo_cards():
    if not os.path.exists(PROMO_CARDS_FILE):
        return jsonify([])
    with open(PROMO_CARDS_FILE, 'r') as f:
        return jsonify(json.load(f))

# ✅ promo-cards PUT (안전 버전으로 수정)
@app.route('/api/promo-cards', methods=['PUT'])
def save_promo_cards():
    cards = request.get_json()
    if not cards or not isinstance(cards, list):
        return jsonify({'error': 'Invalid or empty data'}), 400
    with open(PROMO_CARDS_FILE, 'w') as f:
        json.dump(cards, f)
    return jsonify({'message': 'Promo cards saved.'}), 200

# ✅ Cloudinary 상품 이미지 업로드 (filename 같이 반환)
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    result = cloudinary.uploader.upload(file)
    return jsonify({
        'imageUrl': result['secure_url'],
        'filename': result['public_id']  # ✅ 삭제용 public_id 같이 반환
    })

# ✅ 포스터 업로드
@app.route('/api/upload-banner', methods=['POST'])
def upload_banner():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    result = cloudinary.uploader.upload(file, folder='banners')
    new_banner = {
        'image': result['secure_url'],
        'filename': result['public_id']
    }
    if os.path.exists(BANNERS_FILE):
        with open(BANNERS_FILE, 'r') as f:
            banners = json.load(f)
    else:
        banners = []
    banners.append(new_banner)
    with open(BANNERS_FILE, 'w') as f:
        json.dump(banners, f)
    return jsonify(new_banner), 200

# ✅ 포스터 조회
@app.route('/api/banners', methods=['GET'])
def get_banners():
    if not os.path.exists(BANNERS_FILE):
        return jsonify([])
    try:
        with open(BANNERS_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception:
        return jsonify([])

# ✅ 포스터 삭제
@app.route('/api/delete-banner', methods=['POST'])
def delete_banner():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    cloudinary.uploader.destroy(filename)
    if not os.path.exists(BANNERS_FILE):
        return jsonify([])
    with open(BANNERS_FILE, 'r') as f:
        banners = json.load(f)
    banners = [b for b in banners if b.get('filename') != filename]
    with open(BANNERS_FILE, 'w') as f:
        json.dump(banners, f)
    return jsonify({'message': 'Deleted'}), 200

# ✅ React 빌드 서빙
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
