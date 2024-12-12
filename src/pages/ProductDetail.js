import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../assets/icons/icons";
import { useParams } from "react-router-dom";
import { useCart } from "../utils/hooks/useCart";
import { useProduct } from "../utils/hooks/useProduct";
import { useWishlist } from "../utils/hooks/useWishlist";
import { formatPrice } from "../utils/hooks/useUtil";
import { HelmetProvider, Helmet } from "react-helmet-async";

function ProductDetail() {
  const { nameAlias } = useParams();
  const { addToCart } = useCart();
  const { products, fetchProducts } = useProduct();
  const { wishlistItems, toggleWishlistItem } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);

  // Kiểm tra nếu item đã có trong wishlist
  const itemExists = wishlistItems.find(
    (item) => item?.nameAlias === product?.nameAlias
  );

  // Lấy dữ liệu sản phẩm từ localStorage
  useEffect(() => {
    fetchProducts(); // Gọi API hoặc tải dữ liệu sản phẩm
  }, []);

  // Cập nhật selectedSize khi sản phẩm được tìm thấy
  useEffect(() => {
    const foundProduct = products.find((p) => p.nameAlias === nameAlias);
    if (foundProduct) {
      setProduct(foundProduct);
      localStorage.setItem("product", JSON.stringify(foundProduct));
    }
  }, [products, nameAlias]);

  useEffect(() => {
    if (product && !selectedSize) {
      setSelectedSize(product.productSizes[0]); // Mặc định chọn size đầu tiên
    }
  }, [product]);

  // Meta tags cho Open Graph và Twitter Card
  useEffect(() => {
    if (product) {
      console.log("OG Meta Tags: ", {
        title: product.name,
        description: product.description,
        image:
          product.imageURL ||
          "https://res.cloudinary.com/dahzoj4fy/image/upload/v1733244037/fg6rbhwjrx2cyrq6uc7i.png", // Default image
        url: window.location.href,
      });
    }
  }, [product]);

  if (!product || !selectedSize) {
    return <div>Loading...</div>; // Trả về loading khi chưa có sản phẩm hoặc chưa chọn size
  }

  // URL chia sẻ lên Twitter
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    product.name
  )}&url=${encodeURIComponent(window.location.href)}&hashtags=product,shopping`;

  return (
    <>
      <Helmet>
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={product?.name} />
        <meta property="og:description" content={product?.description} />
        <meta property="og:image" content={product?.imageURL} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MinhHieu454788" />
        <meta name="twitter:title" content={product?.name} />
        <meta name="twitter:description" content={product?.description} />
        <meta name="twitter:image" content={product?.imageURL} />
        <title>{product.name}</title>
      </Helmet>
      <div className="flex container">
        <div className="product-detail-img flex-2">
          <img src={product.imageURL} alt={product.name} />
        </div>

        <div className="product-detail-about flex-1">
          <h1>{product.name}</h1>
          <h2>{product.brand}</h2>

          <div>
            <label htmlFor="size-select">Available sizes</label>
            <select
              id="size-select"
              value={JSON.stringify(selectedSize)} // Tránh việc sử dụng trực tiếp selectedSize
              onChange={(e) => setSelectedSize(JSON.parse(e.target.value))}
            >
              {product.productSizes
                .sort((a, b) => a.size - b.size)
                .map((size, index) => (
                  <option key={index} value={JSON.stringify(size)}>
                    EU {size.size} - {formatPrice(size.price)}{" "}
                    {size.quantity <= 3 ? `(only ${size.quantity} left)` : ""}
                  </option>
                ))}
            </select>
          </div>

          <div className="divider">
            <button
              onClick={() =>
                addToCart({
                  product: product,
                  productPrice: selectedSize.price,
                  productSizeID: selectedSize.productSizeID,
                  productSize: selectedSize.size,
                  quantity: 1,
                })
              }
            >
              ADD TO BASKET
            </button>

            <button
              className="second-button"
              onClick={() => toggleWishlistItem(product)}
            >
              <span>WISHLIST</span>
              <FontAwesomeIcon
                icon={itemExists ? icons.heartFull : icons.heart}
              />
            </button>
          </div>

          <p>{product.description}</p>

          <div className="flex justify-end w-full mt-4 ml-4">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter-share-button"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
