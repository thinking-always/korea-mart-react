from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os, json, cloudinary, cloudinary.uploader
from werkzeug.utils import secure_filename

# ✅ Cloudinary 설정
cloudinary.config(
    cloud_name='dnhoeuj4t',
    api_key='118544432646378',
    api_secret='N-g_TvykAHzLHgJM2yfNkbwHyjY'
)

# ✅ 기본 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_FOLDER = os.path.join(BASE_DIR, 'build')  # React build 폴더
DATA_FILE = os.path.join(BASE_DIR, 'products.json')
PROMO_CARDS_FILE = os.path.join(BASE_DIR, 'promo_cards.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, static_folder=BUILD_FOLDER, static_url_path='')
#CORS(app, origins=["https://korea-mart-react-3.onrender.com"])
# 🔥 이걸로 수정
CORS(app, supports_credentials=True, origins="*")



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ 상품 이미지 업로드 → Cloudinary
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    result = cloudinary.uploader.upload(file)
    return jsonify({'imageUrl': result['secure_url']})

# ✅ 배너 이미지 업로드 → Cloudinary
@app.route('/api/upload-banner', methods=['POST'])
def upload_banner():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400

    try:
        result = cloudinary.uploader.upload(file, folder='banners')
        new_banner = {
            'url': result['secure_url'],
            'filename': result['public_id'],
            'title': '',
            'description': ''
        }

        # 기존 목록 불러오기
        if os.path.exists(PROMO_CARDS_FILE):
            with open(PROMO_CARDS_FILE, 'r') as f:
                banners = json.load(f)
        else:
            banners = []

        banners.append(new_banner)

        # 덮어쓰기
        with open(PROMO_CARDS_FILE, 'w') as f:
            json.dump(banners, f)

        return jsonify(new_banner), 200
    except Exception as e:
        return jsonify({'error': f'Cloudinary upload failed: {str(e)}'}), 500



# ✅ 배너 리스트 → promo_cards.json에서 관리
@app.route('/api/banners', methods=['GET'])
def get_banners():
    if not os.path.exists(PROMO_CARDS_FILE):
        return jsonify([])
    with open(PROMO_CARDS_FILE, 'r') as f:
        return jsonify(json.load(f))

# ✅ 배너 삭제 (json 목록에서만 삭제)
@app.route('/api/delete-banner', methods=['POST'])
def delete_banner():
    data = request.get_json()
    filename = data.get('filename')  # ex) "banners/abc123"

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    try:
        # 🔥 Cloudinary에서 이미지 삭제
        cloudinary.uploader.destroy(filename)
    except Exception as e:
        return jsonify({'error': f'Cloudinary deletion failed: {str(e)}'}), 500

    # JSON에서 항목 제거
    if not os.path.exists(PROMO_CARDS_FILE):
        return jsonify({'error': 'No promo cards found'}), 404

    with open(PROMO_CARDS_FILE, 'r') as f:
        cards = json.load(f)

    cards = [card for card in cards if card.get('filename') != filename]

    with open(PROMO_CARDS_FILE, 'w') as f:
        json.dump(cards, f)

    return jsonify({'message': 'Deleted'}), 200


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

# ✅ 프로모 카드 json 저장/불러오기
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

# ✅ React SPA 라우팅
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# ✅ 실행
if __name__ == '__main__':
    app.run(debug=True)
