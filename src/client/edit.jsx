import React from "react";
import MenuItem from "./menu_item";

export class Edit extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            menuItem: null,
            error: null
        };

        this.menuItemId = new URLSearchParams(window.location.search).get("menuItemId");

        if (this.menuItemId === null){
            this.state.error = "Unspecified menuitem id";
        }
    }


    componentDidMount() {
        if (this.state.error === null){
            this.fetchMenu();
        }

        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
    }

    async fetchMenu(){

        const url = "/api/menu" + this.menuItemId;

        let response;
        let payload;

        try {
            response = await fetch(url);
            payload = response.json();
        } catch (err) {
            this.setState({
                error: "Error when retrieving menu item: " + err,
                menuItem: null
            });
            return;
        }

        if (response.status === 200){
            this.setState({
                error: null,
                menuItem: payload
            });
        } else {
            this.setState({
                error: "Issue with the HTTP connection: status code: " + response.status,
                menuItem: null
            })
        }

    }


    onOk = async (name, description, dayOfWeek, id) => {
        const url = "/api/menu/" + id;

        const payload = {id, name, description, dayOfWeek};

        let response;

        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            return false;
        }

        return response.status === 204;
    };


    render() {
        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;

        if (this.state.error !== null){
            return (
                <div>
                    <p>Cannot edit Menu Item. {this.state.error}</p>
                </div>
            );
        }

        if (this.state.menuItem === null){
            return (
                <p>Loading...</p>
            );
        }



        return (
            <div>
                {loggedIn ? (
                    <div>
                        <h3>Edit Menu Item</h3>
                        <MenuItem
                            name={this.state.menuItem.name}
                            description={this.state.menuItem.description}
                            dayOfWeek={this.state.menuItem.dayOfWeek}
                            menuItemId={this.menuItemId}
                            ok={"Update"}
                            okCallback={this.onOk}
                        />
                    </div>
                ) : (
                    <div className="menuWrapper">
                        <h2>Failed to execute </h2>
                        <p>You need to log in or register</p>
                    </div>
                )}


            </div>
        );
    }

}