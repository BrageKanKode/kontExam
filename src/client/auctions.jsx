import React from "react";
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';

import auctions from './../server/db/auctions'


export class Auctions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            auctionItems: null,
            error: null
        }
    }

    componentDidMount() {

        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }

        this.fetchAuctionItems();
    }

    async fetchAuctionItems(){
        const url = "/api/auctions";

        let response;
        let payload;

        try {
            response = await fetch(url);
            payload = await response.json();
        } catch (err) {
            this.setState({
                error: "Error when retrieving list of auctions: " + err,
                auctionItems: null
            });
            return;
        }

        if (response.status === 200) {
            this.setState({
                error: null,
                auctionItems: payload
            });
        } else {
            this.setState({
                error: "Issue with HTTP connection: status code " + response.status,
                auctionItems: null
            });
        }
    }


    deleteAuction = async (id) => {
        const url = "/api/Auctions/" + id;

        let response;

        try {
            response = await fetch(url, {method: "delete"});
        } catch (err) {
            alert("Delete operation failed: " + err);
            return false;
        }

        if (response.status !== 204) {
            alert("Delete operation failed: status code " + response.status);
            return false;
        }

        this.fetchAuctionItems();

        return true;
    };

    markAuctionAsSold = async (id, name, description, price, currentBid, available, userId) => {
        const url = "/api/auctions/" + id;
        if(available){
            available = false
        } else {
            available = true
        }
        const payload = {id, name, description, price, currentBid, available, userId};

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

        this.fetchAuctionItems();


        return response.status === 204;

    }


    render() {

        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;



        let table;

        if (this.state.error){
            table = <p>{this.state.error}</p>
        } else if(!this.state.auctionItems || this.state.auctionItems.length === 0) {
            table = <p>There is no auction registered in the database</p>
        } else {
            table = <div>
                <table className="completeMenu">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Current bid</th>
                        <th>Available</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.auctionItems.map(m =>
                        <tr key={"key_" + m.id} className="oneMenuItem">
                            <td>{m.name}</td>
                            <td>{m.description}</td>
                            <td>{m.price}</td>
                            <td>{m.currentBid}</td>
                            {m.available ? (
                                <td>Available</td>
                            ) : (
                                <td>Sold</td>
                            )}
                            <td>
                                {loggedIn ? (
                                    <div>
                                        {this.props.user.userId !== m.userId && m.available && (
                                            <Link to={"/edit?auctionId=" + m.id}>
                                                <button className="btn">Bid</button>
                                            </Link>
                                        )}
                                        {this.props.user.userId === m.userId && (
                                            <div>
                                                <button className="btn" onClick={_ => this.deleteAuction(m.id)}>Delete</button> <br/>
                                                <button className="btn" onClick={_ => this.markAuctionAsSold(m.id, m.name, m.description, m.price, m.currentBid, m.available, m.userId)}>Toggle Sold</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p>Log in to access</p>
                                    </div>
                                )}

                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        }




        return (
            <div className="menuWrapper">

                {loggedIn ? (
                    <div>
                        <h2>Auction list</h2>
                        <Link to={"/create"}>
                            <button className="btn">Add new Auction</button>
                        </Link>
                        {table}

                    </div>
                ) : (
                    <div>
                        <h2>Auction list</h2>

                        {table}
                    </div>
                )}


            </div>
        );
    }
}

export default withRouter(Auctions);