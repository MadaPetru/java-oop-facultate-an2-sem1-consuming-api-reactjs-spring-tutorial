class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {animals: []}
    }

    componentDidMount() {
        client({method: 'GET', path: '/animals'})
            .done(response => {
                this.setState({animals: response.entity._embedded.animalsList})
            })
    }

    render() {
        return (
            <AnimalList animals={this.state.animals}/>
        )
    }
}

class AnimalList extends React.Component {
    render() {
        const animals = this.props.animals.map(animal=>
            <Animal key = {animal._links.self.href} animal = {animal}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th> Name </th>
                    </tr>
                    {animals}
                </tbody>
            </table>
        )
    }
}

class Animal extends React.Component{
    render(){
        return (
            <tr>
                <td>this.props.animal.name</td>
            </tr>
        )
    }
}
console.log("adii");
ReactDOM.render(
    <App />,
    document.getElementById('react')
)