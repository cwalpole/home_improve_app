import styles from "./SocialIcons.module.css";

const icons = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    className: styles.facebook,
    path: "M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33v7.03C18.34 21.2 22 17.06 22 12.06z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    className: styles.instagram,
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.75-2.75a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    className: styles.linkedin,
    path: "M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M8.34 17V10.67H6V17H8.34M7.16 9.5A1.34 1.34 0 1 0 7.17 6.83 1.34 1.34 0 0 0 7.16 9.5M18 17V13.5C18 12.12 17.63 10.67 15.82 10.67C15 10.67 14.38 11.17 14.13 11.7H14.09V10.67H11.84V17H14.18V13.8C14.18 13.07 14.28 12.38 15.17 12.38C16.05 12.38 16.06 13.2 16.06 13.83V17H18Z",
  },
];

export default function SocialIcons() {
  return (
    <div className={styles.socials} aria-label="Social media">
      {icons.map((icon) => (
        <a
          key={icon.name}
          href={icon.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.icon} ${icon.className}`}
          aria-label={icon.name}
        >
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d={icon.path} fill="currentColor" />
          </svg>
        </a>
      ))}
    </div>
  );
}
