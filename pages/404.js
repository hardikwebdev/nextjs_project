// pages/404.js
import Seo from "@/shared/layout-components/seo/seo";
import styles from '../styles/404.module.css';

export default function Custom404() {
  return (
    <>
      <Seo title={"Page not found"} />
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.description}>Sorry, this page does not exist.</p>
      </div>
    </>
  );
}
