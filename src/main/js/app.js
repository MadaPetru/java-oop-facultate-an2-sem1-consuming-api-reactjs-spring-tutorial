const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {animals: []}
    }

    componentDidMount() {
        client({method: 'GET', path: '/animals'})
            .done(response => {
                console.log(response.entity._embedded.animalList);
                this.setState({animals: response.entity._embedded.animalList})
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
        const animals = this.props.animals.map(animal =>
            <Animal key={animal._links.self.href} animal={animal}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th> Name</th>
                    <th> Breed</th>
                </tr>
                {animals}
                </tbody>
            </table>
        )
    }
}

class Animal extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.animal.name}</td>
                <td>{this.props.animal.breed}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react-mount-point')
)