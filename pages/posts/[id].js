import Head from 'next/head';
import Layout from '../../components/layout';
import Date from '../../components/date';
import styles from '../../styles/Post.module.css';
import { getAllPostIds, getPostData } from '../../lib/posts-firebase'; // Change from posts-json to posts-firebase

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className={styles.post}>
        <h1 className={styles.title}>{postData.title}</h1>
        <p className={styles.meta}>
          <Date dateString={postData.date} />
        </p>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
