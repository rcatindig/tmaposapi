import React, { Component } from 'react';

// react-table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// moment
import Moment from 'moment';

// custom components
import { Card, PageHeader, PageWrapper, Modal, Select } from '../../components';

// constants 
import { API } from '../../constants';

const client_url = API.CLIENTS;
const country_url = API.COUNTRIES;
const states_url = API.STATES;
const users_url = API.USERS;


class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pages: null,
            sorted: [],
            pageSize: "",
            filtered: [],
            loading: true,
            showModal: false,
            userId: "",
            first_name: "",
            middle_name: "",
            surname: "",
            extension: "",
            address: "",
            email: "",
            country_id: "",
            state_id: "",
            username: "",
            password: "",                
            status: "",
            confirmPassword: "",
            countryOptions: [],
            statesOptions: [],
            isChecked: true,
        }

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = (state, instance) => {

        this.setState({ loading: true })

        let self = this;

        const url = users_url + 'getUserList/';

        const { pageSize, page, sorted, filtered } = state;

        this.setState({pageSize: pageSize, 
                        page: page, 
                        sorted: sorted, 
                        filtered: filtered});

        const data =  {
            pageSize: pageSize,
            page: page,
            sorted: sorted,
            filtered: filtered,
            showModal: false,
        }

        fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                })
            }).then((response) => { 
                return response.json();
            }).then((res) => {
                //self.setState({data: responseData});

                const pages = Math.ceil(res.totalRecords / pageSize) ;
                self.setState({
                    data: res.transactions,
                    pages: pages,
                    loading: false
                });
            })
        .catch(function(err){
            console.log(err);
        })
    }

    saveData = () => {

        const { 
            userId,
            first_name,
            middle_name,
            surname,
            extension,
            address,
            email,
            country_id,
            state_id,
            username,
            password,                
            status,
            confirmPassword,
         } = this.state;

         var data = {
            first_name: first_name,
            middle_name: middle_name,
            surname: surname,
            extension: extension,
            address: address,
            email: email,
            country_id: country_id,
            state_id: state_id,
            username: username,
            password: password,                
            status: status,
            id: userId
         }


        if(userId !== "")
            this.updateUser(data);
        else
            this.addUser(data);

    }

    addUser = (data) => {
        data.date_created = Moment().format("YYYY-MM-DD HH:mm:ss");
        data.date_modified = Moment().format("YYYY-MM-DD HH:mm:ss");

        var self = this;

        fetch(users_url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then((response) => {

                var dataState = {
                    pageSize: self.state.pageSize,
                    page: self.state.page,
                    sorted: self.state.sorted,
                    filtered: self.state.filtered
                };
                self.fetchData(dataState, []);

                this.setState({openModal: false});
                return response.json();
                
            }).then((res) => {
                //
            })
        .catch(function(err){
            console.log(err);
        })
    }

    updateUser = (data) => {
        data.date_modified = Moment().format("YYYY-MM-DD HH:mm:ss");

        var id = data.id;

        var self = this;

        fetch(users_url + id, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then((response) => {

                var dataState = {
                    pageSize: self.state.pageSize,
                    page: self.state.page,
                    sorted: self.state.sorted,
                    filtered: self.state.filtered
                };
                self.fetchData(dataState, []);

                this.setState({openModal: false});
                return response.json();
                
            }).then((res) => {
                //
            })
        .catch(function(err){
            console.log(err);
        })
    }
    

    handleEditButtonClick (e, row) {
        var data = row._original;
        var id = data.id;

        var self = this;

        fetch(users_url + id)
            .then(results => { 
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    var result = res[0];
                    self.setState({
                        openModal: true,
                        userId: result.id,
                        first_name: result.first_name,
                        middle_name: result.middle_name,
                        surname: result.surname,
                        extension: result.extension,
                        address: result.address,
                        email: result.email,
                        country_id: result.country_id,
                        state_id: result.state_id,
                        username: result.username,
                        password: result.password,                
                        status: result.status,
                        confirmPassword: result.password,
                        statesOptions: []
                    });

                    this.getStateOptions(result.country_id);
                }
            })
        .catch(function(err){
            console.log(err);
        });


         fetch(country_url)
            .then(results => { 
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    for(var i = 0; i < res.length; i++)
                    {
                        var country = res[i];
                        var optionData = {
                            value: country.id,
                            label: country.name
                        }

                        countryOptions.push(optionData);
                    }

                    this.setState({countryOptions: countryOptions})
                    
                }
            })
        .catch(function(err){
            console.log(err);
        })


        const countryOptions = [];

        fetch(country_url)
            .then(results => { 
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    for(var i = 0; i < res.length; i++)
                    {
                        var country = res[i];
                        var optionData = {
                            value: country.id,
                            label: country.name
                        }

                        countryOptions.push(optionData);
                    }

                    this.setState({countryOptions: countryOptions})
                    
                }
            })
        .catch(function(err){
            console.log(err);
        })

        
    }

    openModal = () => {

        this.setState({openModal: true, 
            userId: "",
            first_name: "",
            middle_name: "",
            surname: "",
            extension: "",
            address: "",
            email: "",
            country_id: "",
            state_id: "",
            username: "",
            password: "",                
            status: "",
            confirmPassword: "",
            statesOptions: [],
        });

        const countryOptions = [];

        fetch(country_url)
            .then(results => { 
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    for(var i = 0; i < res.length; i++)
                    {
                        var country = res[i];
                        var optionData = {
                            value: country.id,
                            label: country.name
                        }

                        countryOptions.push(optionData);
                    }

                    this.setState({countryOptions: countryOptions})
                    
                }
            })
        .catch(function(err){
            console.log(err);
        })


        this.setState({openModal: true})

    }

    closeModal = () => this.setState({openModal: false, 
                                        userId: "",
                                        first_name: "",
                                        middle_name: "",
                                        surname: "",
                                        extension: "",
                                        address: "",
                                        email: "",
                                        country_id: "",
                                        state_id: "",
                                        username: "",
                                        password: "",                
                                        status: "",
                                        confirmPassword: "",
                                        statesOptions: [],
                                    });

    onChangeCountry = (event) => {
        const countryId = event.target.value;
        this.setState({country_id: countryId});


        // refresh the state options based on its country.
        this.getStateOptions(countryId);
    }

    getStateOptions = (countryId) => {
        const url = states_url + "getStatesByCountry/" + countryId;

        const statesOptions = [];

        fetch(url)
            .then(results => { 
                this.setState({statesOptions: []});
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    for(var i = 0; i < res.length; i++)
                    {
                        var state = res[i];
                        var optionData = {
                            value: state.id,
                            label: state.name
                        }

                        statesOptions.push(optionData);
                    }

                    this.setState({statesOptions: statesOptions});
                    
                }
            })
        .catch(function(err){
            console.log(err);
        })
    }

    _handleCheckboxChange = () => this.setState( { isChecked: !this.state.isChecked } );


    render () {

        const { data,
                pages,
                loading,
                openModal,
                userId,
                first_name,
                middle_name,
                surname,
                extension,
                address,
                email,
                country_id,
                state_id,
                username,
                password,                
                status,
                confirmPassword,
             } = this.state;

        const columns = [{
                id: 'u.first_name',
                Header: 'First Name',
                accessor: 'first_name'
            }, {
                id: 'u.middle_name',
                Header: 'Middle Name',
                accessor: 'middle_name'
            }, {
                id: 'u.surname',
                Header: 'Surname',
                accessor: 'surname'
            }, {
                id: 'u.extension',
                Header: 'Extension',
                accessor: 'extension'
            },  {
                id: 'pc.name',
                Header: 'Company',
                accessor: 'company'
            }, {
                id: 'u.address',
                Header: 'Address',
                accessor: 'address'
            },  {
                id: 'pc.name',
                Header: 'Country',
                accessor: 'country'
            }, {
                id: 'ps.name',
                Header: 'State',
                accessor: 'state'
            }, {
                id: 'c.status',
                Header: 'Status',
                accessor: c => {
                    return c.status === 0 ? "Active" : "Inactive";
                }
            }, {
                Header: 'Action',
                id: 'edit-button',
                Cell: ({row}) => (<div className="action-container"><button className="table-edit-button" onClick={(e) => this.handleEditButtonClick(e, row)}>Edit</button></div>)
            }
        ];

     
        return (
            <PageWrapper>
                <PageHeader title="Users"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <Card 
                                title="Users"
                                subTitle="List of Users"
                                buttons={[{id: "add-button", 
                                    class: "btn btn-success waves-effect waves-light pull-right", 
                                    title: "Add",
                                    onClick: this.openModal
                                }]}
                                >
                                <div className="table-responsive m-t-20">
                                    <ReactTable
                                        className="-striped -highlight"
                                        manual
                                        columns={columns}
                                        data={data}
                                        pages={pages}
                                        loading={loading}
                                        defaultPageSize={10}
                                        onFetchData={this.fetchData}
                                        minRows={0}
                                        filterable
                                        resizable={true}
                                        style={{fontFamily: "Lato,'Helvetica Neue', Arial,Helvetica,sans-serif", fontSize: "14px"}}
                                    />
                                </div>
                            </Card>
                        
                        </div> 
                    </div>
                </div>

                <Modal
                    className="modal-component"
                    title="Edit Client"
                    show={openModal}
                    handleCloseClick={this.closeModal}
                    >
                    <div className="modal-body transaction-modal">
                        <form className="form-control">
                            <input type="hidden" value={userId}/>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="first_name">First Name</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="first_name" 
                                        placeholder="First Name" 
                                        value={first_name} 
                                        onChange={(event) => this.setState({first_name: event.target.value })}/>
                                </div>                           
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="middle_name">Middle Name</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="middle_name" 
                                        placeholder="Middle Name" 
                                        value={middle_name} 
                                        onChange={(event) => this.setState({middle_name: event.target.value })}/>
                                </div> 
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-8">
                                    <label htmlFor="middle_name">Surname</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="middle_name" 
                                        placeholder="Middle Name" 
                                        value={middle_name} 
                                        onChange={(event) => this.setState({middle_name: event.target.value })}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="middle_name">Extension</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="extension" 
                                        placeholder="Extension" 
                                        value={extension} 
                                        onChange={(event) => this.setState({extension: event.target.value })}/>
                                </div> 
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="address">Address</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="address" 
                                        placeholder="Address" 
                                        value={address} 
                                        onChange={(event) => this.setState({address: event.target.value })}/>
                                </div>                            
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="country">Country</label>
                                    <Select
                                        id="country"
                                        className="form-control"
                                        name="country"
                                        options={this.state.countryOptions}
                                        value={country_id}
                                        onChange={this.onChangeCountry}
                                        placeholder="Select Country..."
                                    />
                                    
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="state">State / Region</label>

                                    <Select
                                        id="state"
                                        className="form-control"
                                        name="state"
                                        options={this.state.statesOptions}
                                        value={state_id}
                                        placeholder="Select State/Region..."
                                        onChange={(event) => this.setState({state_id: event.target.value })}
                                    />
                                </div>
                                
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" 
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        value={email} 
                                        onChange={(event) => this.setState({email: event.target.value })}/>
                                </div>
                            </div>
                            <fieldset>
                                <legend>User Credentials</legend>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" 
                                            className="form-control"
                                            id="username"
                                            placeholder="Username"
                                            value={username} 
                                            onChange={(event) => this.setState({username: event.target.value })}/>
                                    </div>
                                    
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" 
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                            value={password} 
                                            onChange={(event) => this.setState({password: event.target.value })}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="confirmpassword">Confirm Password</label>
                                        <input type="password" 
                                            className="form-control"
                                            id="confirmpassword"
                                            placeholder="Username"
                                            value={confirmPassword} 
                                            onChange={(event) => this.setState({confirmPassword: event.target.value })}/>
                                    </div>
                                </div>
                            </fieldset>
                            
                            <div className="form-row">

                                <div className="form-group col-md-6">
                                    <label htmlFor="status">Status</label>
                                    <Select
                                        id="status"
                                        placeholder="Select Status..."
                                        className="form-control"
                                        name="status"
                                        options={[{value: 0, label: "Active"}, {value: 1, label: "Inactive"}]}
                                        value={status}
                                        onChange={(event) => this.setState({status: event.target.value })}
                                    />
                                    
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={() => this.saveData()}>Save changes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => this.closeModal()} data-dismiss="modal" >Close</button>
                    </div>
                </Modal>
                
            </PageWrapper>
        );
        
    }
}


export { Users };