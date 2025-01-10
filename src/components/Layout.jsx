import PropTypes from "prop-types"
import Navbar from "./Navbar"
import propType from 'prop-types'

const Layout = ({ children }) => {
  return (
    <>
        <Navbar />
        <main>
            {children}
        </main>
    </>
  )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
