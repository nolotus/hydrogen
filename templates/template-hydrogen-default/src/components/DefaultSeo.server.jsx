import {
  useShopQuery,
  Seo,
  CacheDays,
  useServerAnalytics,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

/**
 * A server component that fetches a `shop.name` and sets default values and templates for every page on a website
 */
export default function DefaultSeo() {
  const {
    data: {
      shop: {name, description, id},
    },
  } = useShopQuery({
    query: QUERY,
    cache: CacheDays(),
    preload: '*',
  });

  useServerAnalytics({
    shopify: {
      shopId: id,
    },
  });

  return (
    <Seo
      type="defaultSeo"
      data={{
        title: name,
        description,
      }}
    />
  );
}

const QUERY = gql`
  query shopInfo {
    shop {
      id
      name
      description
    }
  }
`;
