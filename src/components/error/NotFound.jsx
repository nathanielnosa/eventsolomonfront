import { FaSadCry } from "react-icons/fa"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 py-5 mx-auto text-center">
          <FaSadCry style={{ fontSize: "8rem" }} />
          <div className="display-4 fw-bold my-2">404</div>
          <div className="display-6 my-2">Page Not Found</div>
          <p className="lead">
            The page you were looking for doesn&apos;t exist or you may have mistyped the address.
          </p>
          <p className="lead">
            <Link to={"/"} className="text-decoration-none fw-bold text-dark">Go back</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound