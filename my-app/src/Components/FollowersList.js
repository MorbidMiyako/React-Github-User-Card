import React from "react"
import axios from "axios"

class FollowerList extends React.Component {

  constructor() {
    super();
    this.state = {
      followers: ["ehickey08"],
      users: [],
      newUser: "",
      userText: "",
      url: 'https://api.github.com/users/ehickey08/followers'
    }
  }

  componentDidMount() {
    axios
      .get(this.state.url)
      .then(res => {
        console.log(res);
        res.data.forEach(data => {
          this.setState({
            followers: [...this.state.followers, data.login]
          })
        })

        console.log(this.state.followers)

        this.state.followers.forEach(username => {
          axios
            .get(`https://api.github.com/users/${username}`)
            .then(res => {
              this.setState({
                users: [...this.state.users, res.data]
              })
              console.log(this.state.users)
            })
            .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate(prevprops, prevState) {
    if (prevState.url !== this.state.url) {
      axios
        .get(this.state.url)
        .then(res => {
          console.log(res);
          console.log("followers before forEach inside componentDidUpdate", this.state.followers)
          res.data.forEach(data => {
            this.setState({
              followers: [...this.state.followers, data.login]
            })
          })

          console.log("followers in componentDidUpdate", this.state.followers)
          console.log("users before forEach inside componentDidUpdate", this.state.users)
          this.state.followers.forEach(username => {
            axios
              .get(`https://api.github.com/users/${username}`)
              .then(res => {
                this.setState({
                  users: [...this.state.users, res.data]
                })
                console.log(this.state.users)
              })
              .catch(err => {
                console.log(err)
                this.setState({
                  url: 'https://api.github.com/users/BigKnell/followers'
                })
              })
          })
          console.log("users after forEach inside componentDidUpdate", this.state.users)
        })
        .catch(err => console.log(err))
    }
  }

  handleChanges = e => {
    this.setState({
      userText: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("target value inside handleSubmit", this.state.userText)
    this.setState({
      users: [],
      followers: [this.state.userText],
    })
    console.log("newUser after setState in handleSubmit", this.state.userText, "end log")
    this.setState({
      url: `https://api.github.com/users/${this.state.userText}/followers`,
      userText: ''
    })
    console.log("consolelog inside handleSubmit", this)
  }

  render() {

    return (
      <>
        <h1>Followers listing</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="userText"
            value={this.state.userText}
            onChange={this.handleChanges}
          />
          <button>Request listing</button>
        </form>
        {this.state.users.map(user => {
          return (
            <div className="card" key={user.id}>
              <img src={user.avatar_url} alt={""} />
              <div className="card-info">
                <h3 className="name">{user.name}</h3>
                <p className="username">{user.login}</p>
                <p>Location: {user.location}</p>
                <p>Profile:
            <a href={user.url}>More Info</a>
                </p>
                <p>Followers: {user.followers}</p>
                <p>Following: {user.following}</p>
                <p>Bio: {user.bio}</p>
              </div>
            </div>
          )
        })
        }
      </>
    )
  }
}

export default FollowerList
