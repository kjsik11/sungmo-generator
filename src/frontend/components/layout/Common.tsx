import Footer from '../custom/Footer';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="relative">{children}</main>
      <Footer className="mt-8 sm:mt-12" />
    </>
  );
}
