import { Outlet,Link } from "react-router-dom";

const containerStyle = {
    padding: "5px",
    overflow: "hidden",
    margin: "auto",

}

const tableContainerStyle = {
    marginTop: "2%",
}

const butonStyle = {
    width: "80%"
}

export default function Layout() {

    return (
        <>
            <div className="App" >
                <div className="container text-center " style={containerStyle}>
                    <div className="container " style={containerStyle} >
                        <div className="row" style={tableContainerStyle}>
                            <div className="col-lg-4 col-sm-4 col-md-4">
                                <Link to="/home" className="btn btn-primary" style={butonStyle}>ürünler</Link>
                            </div>
                            <div className="col-lg-4 col-sm-4 col-md-4">
                                <Link to="/login" className="btn btn-secondary" style={butonStyle}>login</Link>
                            </div>

                            <div className="col-lg-4 col-sm-4 col-md-4">
                                <Link to="/register" className="btn btn-success" style={butonStyle}>register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Outlet/>
        </>
        
    )
};
