import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../assets/icons/icons";
import { useParams } from "react-router-dom";
import { useCart } from "../utils/hooks/useCart";
import { useProduct } from "../utils/hooks/useProduct";
import { useWishlist } from "../utils/hooks/useWishlist";
import { formatPrice } from "../utils/hooks/useUtil";
import { selectCurrentUser } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";

function ProductDetail() {
  const { nameAlias } = useParams();
  const { addToCart } = useCart();
  const { products, fetchProducts } = useProduct();
  const { wishlistItems, toggleWishlistItem } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);

  const currentUser = useSelector(selectCurrentUser);
  const itemExists = wishlistItems.find(
    (item) => item?.nameAlias === product?.nameAlias
  );

  // Lấy dữ liệu sản phẩm từ localStorage
  const storedProductData = JSON.parse(localStorage.getItem("product")) || null;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const foundProduct = products.find((p) => p.nameAlias === nameAlias);
    if (foundProduct) {
      setProduct(foundProduct);
      // Lưu thông tin sản phẩm vào localStorage khi sản phẩm thay đổi
      localStorage.setItem("product", JSON.stringify(foundProduct));
    }
  }, [products, nameAlias]);

  // Initialize Facebook SDK
  useEffect(() => {
    if (window.FB) {
      window.FB.init({
        appId: "947940970532246", // App ID của bạn
        xfbml: true,
        version: "v10.0",
      });
    } else {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/vi_VN/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.FB.init({
          appId: "947940970532246",
          xfbml: true,
          version: "v10.0",
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  // Hiển thị thông tin OG meta tags nếu có sản phẩm
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

  return (
    <>
      {product && (
        <>
          <HelmetProvider>
            <Helmet>
              <meta property="og:url" content={window.location.href} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={product?.name} />
              <meta
                property="og:description"
                content={product?.description}
              />
              <meta
                property="og:image"
                content={product?.imageURL}
              />
              <title>{product.name}</title>
            </Helmet>
          </HelmetProvider>
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
                  value={
                    selectedSize
                      ? JSON.stringify(selectedSize)
                      : JSON.stringify(product.productSizes[0])
                  }
                  onChange={(e) => setSelectedSize(JSON.parse(e.target.value))}
                >
                  {[...product?.productSizes]
                    ?.sort((a, b) => a.size - b.size)
                    .map((size, index) => (
                      <option key={index} value={JSON.stringify(size)}>
                        EU {size?.size} - {formatPrice(size?.price)}{" "}
                        {size.quantity <= 3
                          ? `(only ${size.quantity} left)`
                          : ""}
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
                <div
                  className="fb-share-button"
                  data-href={window.location.href}
                  data-layout="button_count"
                  data-size="large"
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductDetail;
