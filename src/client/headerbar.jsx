import React from "react";
import { Link, withRouter } from "react-router-dom";


export class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
    }

    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, { method: "post" });
        } catch (err) {
            alert("Failed to connect to server: " + err);
            return;
        }

        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null);
        this.props.history.push("/");
    };

    renderLoggedIn(userId) {
        return (
            <div className="msgDiv">
                <h3 className="notLoggedInMsg">
                    Welcome {userId} - Nice to see you!
                </h3>

                <button className="btn btnPartHeader" id="logOutBtn" onClick={this.doLogout}>
                    Logout
                </button>
            </div>
        );
    }

    renderNotLoggedIn() {
        return (
            <div className="msgDiv">
                <div className="notLoggedInMsg">You are not logged in</div>
                <div className="btnPartHeader">
                    <Link className="btn" to="/login">
                        LogIn
                    </Link>
                    <Link className="btn" to="/signup">
                        SignUp
                    </Link>
                </div>
            </div>
        );
    }

    render() {
        const userId = this.props.userId;

        let content;
        if (! userId) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }

        return (
            <div className={"headerBar"}>
                <Link className="btn home" to={"/"}>
                    Home
                </Link>
                {content}
            </div>
        );
    }
}

export default withRouter(HeaderBar);