const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {animals: []}
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'animals', params: {size: pageSize}}]
        ).then(animalCollection => {
            return client({
                method: 'GET',
                path: animalCollection.entity._links.self.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return animalCollection;
            });
        }).done(animalCollection => {
            this.setState({
                animals: animalCollection.entity._embedded.animalList,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: animalCollection.entity._links});
        });
    }

    render() {
        return (
            <AnimalList animals={this.state.animals}/>
        )
    }

    onDelete(animal) {
        client({method: 'DELETE', path: animal._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }

    onCreate(newEmployee) {
        follow(client, root, ['animals']).then(animalCollection => {
            return client({
                method: 'POST',
                path: animalCollection.entity._links.self.href,
                entity: newEmployee,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'animals', params: {'size': this.state.pageSize}}]);
        }).done(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(animalCollection => {
            this.setState({
                animals: animalCollection.entity._embedded.animalList,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: animalCollection.entity._links
            });
        });
    }
}

class AnimalList extends React.Component {
    render() {
        const animals = this.props.animals.map(animal =>
            <Animal key={animal._links.self.href} animal={animal} onDelete={this.props.onDelete}/>
        );

        const navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }

        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                <table>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                    {animals}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }
}

class Animal extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.animal);
    }

    render() {
        return (
            <tr>
                <td>{this.props.animal.name}</td>
                <td>{this.props.animal.breed}</td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        )
    }
}

class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const newAnimal = {};
        this.props.attributes.forEach(attribute => {
            newAnimal[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newAnimal);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field"/>
            </p>
        );

        return (
            <div>
                <a href="#createAnimal">Create</a>

                <div id="createAnimal" className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new animal</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

ReactDOM.render(
    <App/>,
    document.getElementById('react-mount-point')
)