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


class Clients extends Component {

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
            clientId: "",
            name: "",
            address: "",
            country_id: "",
            state_id: "",
            email: "",
            tel_no: "",
            status: "",
            date_created: "",
            date_modified: "",
            countryOptions: [],
            statesOptions: [],
        }

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData = (state, instance) => {

        this.setState({ loading: true })

        let self = this;

        const url = API.CLIENTS + 'getClientList/';

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
            name,
            address,
            country_id,
            state_id,
            email,
            tel_no,
            status,
            clientId
         } = this.state;

         var data = {
             name: name,
             address: address,
             country_id: country_id,
             state_id: state_id,
             email: email,
             tel_no: tel_no,
             status: status,
             id: clientId
         }


        if(clientId !== "")
            this.updateClient(data);
        else
            this.addClient(data);

    }

    addClient = (data) => {
        
    }

    updateClient = (data) => {
        data.date_modified = Moment().format("YYYY-MM-DD HH:mm:ss");

        var id = data.id;

        const url = API.CLIENTS + id;

        var self = this;

        fetch(url, {
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

        const url = API.CLIENTS + id;

        fetch(url)
            .then(results => { 
                return results.json();
            }).then(res => {
                if(res.length > 0)
                {
                    var result = res[0];
                    self.setState({
                        openModal: true,
                        clientId: result.id,
                        name: result.name,
                        address: result.address,
                        country_id: result.country_id,
                        state_id: result.state_id,
                        email: result.email,
                        tel_no: result.tel_no,
                        status: result.status,
                        date_created: result.date_created,
                        date_modified: result.date_modified,
                        statesOptions: []
                    });

                    this.getStateOptions(result.country_id);
                }
            })
        .catch(function(err){
            console.log(err);
        })

        const country_url = API.COUNTRIES;

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
                                        clientId: "",
                                        name: "",
                                        address: "",
                                        country_id: "",
                                        state_id: "",
                                        email: "",
                                        tel_no: "",
                                        status: "",
                                        date_created: "",
                                        date_modified: "",
                                        statesOptions: [],
                                    });

    onChangeCountry = (event) => {
        const countryId = event.target.value;
        this.setState({country_id: countryId});

        this.setState()
        // refresh the state options based on its country.

        this.getStateOptions(countryId);
    }

    getStateOptions = (countryId) => {
        const states_url = API.STATES + "getStatesByCountry/" + countryId;

        const statesOptions = [];

        fetch(states_url)
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


    render () {

        const { data,
                pages,
                sorted,
                pageSize,
                filtered,
                loading,
                openModal,
                clientId,
                name,
                address,
                country_id,
                state_id,
                email,
                tel_no,
                status,
                date_created,
                date_modified,
             } = this.state;

        const columns = [{
                id: 'c.name',
                Header: 'Name',
                accessor: 'name'
            }, {
                id: 'c.address',
                Header: 'Address',
                accessor: 'address'
            }, {
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
                    return c.status == 0 ? "Active" : "Inactive";
                }
            }, {
                Header: 'Action',
                id: 'edit-button',
                Cell: ({row}) => (<div className="action-container"><button className="table-edit-button" onClick={(e) => this.handleEditButtonClick(e, row)}>Edit</button></div>)
            }
        ];

        var self = this;
     
        return (
            <PageWrapper>
                <PageHeader title="Clients"/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <Card title="Clients" subTitle="List of Clients">
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
                    <div className="modal-body">
                        <form className="form-control">
                            <input type="hidden" value={clientId}/>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="name">Name</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="name" 
                                        placeholder="Name" 
                                        value={name} 
                                        onChange={(event) => this.setState({name: event.target.value })}/>
                                </div>                            
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="address">Address</label>
                                    <input type="text"
                                        className="form-control" 
                                        id="address" 
                                        placeholder="Name" 
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
                                    />
                                    {/* <input type="text" 
                                        className="form-control"
                                        id="country"
                                        placeholder="Country"
                                        value={country_id} 
                                        onChange={(event) => this.setState({country_id: event.target.value })}/> */}
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="state">State / Region</label>

                                    <Select
                                        id="state"
                                        className="form-control"
                                        name="state"
                                        options={this.state.statesOptions}
                                        value={state_id}
                                        onChange={(event) => this.setState({state_id: event.target.value })}
                                    />
                                    {/* <input type="text" 
                                        className="form-control" 
                                        id="state" 
                                        placeholder="State" 
                                        value={state_id} 
                                        onChange={(event) => this.setState({state_id: event.target.value })} /> */}
                                </div>
                                
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" 
                                        className="form-control"
                                        id="email"
                                        placeholder="Email"
                                        value={email} 
                                        onChange={(event) => this.setState({email: event.target.value })}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="tel_no">Telephone No.</label>
                                    <input type="text" 
                                        className="form-control" 
                                        id="tel_no" 
                                        placeholder="Telephone No." 
                                        value={tel_no} 
                                        onChange={(event) => this.setState({tel_no: event.target.value })} />
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


export { Clients };