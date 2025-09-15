import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  keywords?: string;
  type?: 'website' | 'article';
}

const SEOHelmet = ({ 
  title, 
  description, 
  url = 'https://cora-network.com',
  image = 'https://cora-network.com/images/coral6.png',
  keywords = 'Coral Magazine, Open Coral Network, NPO法人',
  type = 'website'
}: SEOHelmetProps) => {
  const fullTitle = `${title} | Coral Magazine - Open Coral Network`;
  const googleSiteVerification = (import.meta as any).env?.VITE_GOOGLE_SITE_VERIFICATION as string | undefined;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {googleSiteVerification && (
        <meta name="google-site-verification" content={googleSiteVerification} />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHelmet;
