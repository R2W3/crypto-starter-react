import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className='container'>{children}</div>
    </>
  );
};

export default Layout;
