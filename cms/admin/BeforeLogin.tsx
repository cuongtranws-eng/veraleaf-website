type Props = { i18n?: { language?: string } };

/** Short welcome text above the login form. */
export function BeforeLogin({ i18n }: Props) {
  const en = i18n?.language === 'en';
  return (
    <div className="vl-before-login">
      <h1>{en ? 'Welcome back' : 'Chào mừng trở lại'}</h1>
      <p>{en ? 'Sign in to manage the VeraLeaf website content.' : 'Đăng nhập để quản lý nội dung website VeraLeaf.'}</p>
    </div>
  );
}
