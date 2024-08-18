import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ControlSiderbar from './ControlSiderbar';



function BackOffice(props){
    return <>
        <div className="wrapper">
            <Navbar />
            <Sidebar/>
            <div className="content-wrapper p-3">
                {props.children}
            </div>

            <Footer />
            <ControlSiderbar /> 

        </div>
    </>
}

export default BackOffice;