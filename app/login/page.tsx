import styles from "./login.module.css";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <form method="post" action="/api/auth/login" className={styles.form}>
          <label>
            <span>Email</span>
            <input name="email" type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" required />
          </label>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
