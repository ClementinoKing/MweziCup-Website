import { useEffect } from 'react';
import { SITE_DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site';

type SeoSchema = Record<string, unknown> | Record<string, unknown>[];

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  keywords?: string[];
  schema?: SeoSchema;
};

function setMetaAttribute(attribute: 'name' | 'property', value: string, content: string) {
  const selector = `meta[${attribute}="${value}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function setCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }

  tag.setAttribute('href', href);
}

export default function Seo({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  image = SITE_DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
  keywords,
  schema,
}: SeoProps) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = getSiteUrl(path);
    const imageUrl = getSiteUrl(image);
    const robots = noIndex ? 'noindex, nofollow, noarchive' : 'index, follow';

    document.title = pageTitle;
    setCanonical(canonicalUrl);
    setMetaAttribute('name', 'description', description);
    setMetaAttribute('name', 'robots', robots);
    setMetaAttribute('property', 'og:title', pageTitle);
    setMetaAttribute('property', 'og:description', description);
    setMetaAttribute('property', 'og:type', type);
    setMetaAttribute('property', 'og:url', canonicalUrl);
    setMetaAttribute('property', 'og:image', imageUrl);
    setMetaAttribute('property', 'og:site_name', SITE_NAME);
    setMetaAttribute('name', 'twitter:card', 'summary_large_image');
    setMetaAttribute('name', 'twitter:title', pageTitle);
    setMetaAttribute('name', 'twitter:description', description);
    setMetaAttribute('name', 'twitter:image', imageUrl);

    if (keywords?.length) {
      setMetaAttribute('name', 'keywords', keywords.join(', '));
    } else {
      const existingKeywords = document.head.querySelector<HTMLMetaElement>('meta[name="keywords"]');
      existingKeywords?.remove();
    }

    let schemaTag = document.head.querySelector<HTMLScriptElement>('script[data-seo-schema="true"]');

    if (schema) {
      const schemaContent = Array.isArray(schema) ? schema : [schema];

      if (!schemaTag) {
        schemaTag = document.createElement('script');
        schemaTag.type = 'application/ld+json';
        schemaTag.dataset.seoSchema = 'true';
        document.head.appendChild(schemaTag);
      }

      schemaTag.textContent = JSON.stringify(schemaContent.length === 1 ? schemaContent[0] : schemaContent);
    } else if (schemaTag) {
      schemaTag.remove();
    }
  }, [description, image, keywords, noIndex, path, schema, title, type]);

  return null;
}
