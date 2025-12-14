import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Ruha - Kawaii Digital Playground",
  description = "Discover adorable kawaii-inspired products, bags, and accessories. From cute drinkware to playful tech gadgets, find your perfect kawaii companion.",
  keywords = "kawaii, cute, bags, accessories, drinks, toys, electronics, decor, japan, adorable, kawaii shop",
  image = "/ruha-logo.png",
  url = "https://ruha-store.com",
  type = "website",
  siteName = "Ruha Store",
}) => {
  const fullTitle = title.includes("Ruha") ? title : `${title} - Ruha`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ruha Store" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <link rel="canonical" href={url} />

      {/* Structured Data for Product Pages */}
      {type === "product" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: title.replace(" - Ruha", ""),
            image: [image],
            description: description,
            brand: {
              "@type": "Brand",
              name: "Ruha",
            },
            offers: {
              "@type": "Offer",
              url: url,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      )}

      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Ruha",
          url: "https://ruha-store.com",
          logo: `${url}/ruha-logo.png`,
          sameAs: [
            "https://www.instagram.com/ruha_store",
            "https://www.facebook.com/ruha_store",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
