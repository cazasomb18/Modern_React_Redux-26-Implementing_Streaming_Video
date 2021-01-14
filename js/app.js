////////////////////////////////////////////////////////////////////////////////////////////////////
//Viewing A Stream

	//edit route in App.js:
		<Route path="/streams/show/:id" exact component={StreamShow} />
	//navigate to appropriate page in streamlist.js: 
		renderList(){
			return this.props.streams.map(stream => {
				return (
					<div className="item" key={stream.id}>
						{this.renderAdmin(stream)}
						<i className="large middle aligned icon camera" />
						<div className="content">
							<Link to={`/streams/${stream.id}`} className="header">
								{stream.title}
								{/*wrap stream.title with Link add className*/}
							</Link>
							<div className="description">{stream.description}</div>
						</div>
					</div>
				);
			})
		}//now we should be able to click on a stream link
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Switches with React Router

	//ISSUE: React-router is rendering both StreamShow and StreamCreate @ same page!
	//SOLUTION: we're going to wrap all of our routes in <Switch></Switch> tag App.js:
		//App.js:
		import { Router, Route, Switch } from 'react-router-dom';
		//import switch
		const App = () => {
			return (
				<div className='ui container'>
					<Router history={history}>
						<div>
							<Header />
							<Switch>
							{/*wrap routes in <Switch></Switch*/}
								<Route path="/" exact component={StreamList} />
								<Route path="/streams/new" exact component={StreamCreate} />
								<Route path="/streams/edit/:id" exact component={StreamEdit} />
								<Route path="/streams/delete/:id" exact component={StreamDelete} />
								<Route path="/streams/:id" exact component={StreamShow} />
							{/*switch: looks at different routes and only shows one given 
							per path that we go to: doesn't show any other potential routes*/}
							</Switch>
						</div>
					</Router>
				</div>
			);
		};
		//if react-router isn't showing a component it should then import switch and wrap routes in it
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////	
//Showing a Stream
	//StreamShow.js now looks like this:
	import React from 'react';
	import { connect } from 'react-redux';
	//import connect: 
	import { fetchStream } from '../../actions';
	//We're going to want to make a class-based component to use a lifecycle method
	class StreamShow extends React.Component {
		componentDidMount(){
			this.props.fetchStream(this.props.match.params.id);
			//fetch stream: to look at url find, id in side there
		}
		render(){
			if (!this.props.stream) {
				return <div>Loading...</div>
			}

			const { title, description } = this.props.stream;
			//extracting vars title, description out of this.props.stream object
			return (
				<div>
					<h1>{title}</h1>
					<h5>{description}</h5>
				</div>
			//show it inside render(), now only need {title}/{description}
			);
		}
	}
	const mapStateToProps = (state, ownProps) => {
		const id = ownProps.match.params.id;
		return { stream: state.streams[id] };
		//get stream out of redux store
	};
	export default connect(
		mapStateToProps, 
		{ fetchStream }
	)(StreamShow);
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//RTMP NodeMediaServer is not a constructor error fix

/*In the next lecture we will install the Node Media Server package and create our RTMP server. Our
index.js needs a slight modification to the import for v.2.1.0

https://github.com/illuspas/Node-Media-Server#npm-version-recommended

Instead of:*/
	const { NodeMediaServer } = require('node-media-server');
/*we need to change the import to this:*/
	const NodeMediaServer = require('node-media-server');
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//RTMP Server Setup

	//We now have a full CRUD example put together with react and redux
		//can create
		//can show a record
		//can edit record
		//can delete record

	//Now moving forward we're going to continue with the streaming part of our application
		//this won't be really related to React or Redux at all

	//in terminal api directory:
		//create rtmpserver directory:
			//in rtmpserver/create index.js:
			//run npm init in rtmpserver directory
				//enter all the way through

	//Now navigate here: https://github.com/illuspas/Node-Media-Server
		//npm version (reccommended)
		//now in terminal
			//make sure you're in rtmpserver directory: run 'npm install --save node-media-server'

	//rtmpserver/index.js, copy+paste the full code under npm version (reccommended):
		const NodeMediaServer = require('node-media-server');
		const config = {
		  rtmp: {
		    port: 1935,
		    chunk_size: 60000,
		    gop_cache: true,
		    ping: 30,
		    ping_timeout: 60
		  },
		  http: {
		    port: 8000,
		    allow_origin: '*'
		  }
		};
		var nms = new NodeMediaServer(config)
		nms.run();
	//package.json: add in scripts:
		"start": "node index.js"
		//in terminal api/rtmpserver
			//run node index.js
				//nodemon index.js

	//Note: we should have 3 terminals running
		//client
		//api
		//rtmp server
			//all 3 need to be running for our app to work

	//obsproject.com

	//set up scene:
		//set up video source
		//set up audio source
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Video Player Setup
	//We're going to work implementing this video players on ShowStream.js

	//node media server documentation:
		//https://github.com/illuspas/Node-Media-Server
			//http-flv === flash player format
		//via flv.js over http-flv:
			//this is essentially what we're going to do
				//need to translate this code exmaple into normal react code:

	//flv.js library
		//documentation: npmjs.com/package/flv.js > getting started:
			//example of code:

	//in terminal: client run 'npm install --save flv.js'
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Implementing FLV JS
	
	//in StreamShow.js, going to make use of our flv lib:
		import React from 'react';
		import { connect } from 'react-redux';
		import flv from 'flv.js';
		//import flv lib
		import { fetchStream } from '../../actions';

		class StreamShow extends React.Component {
			constructor(props){
				super(props);
				this.videoRef = React.createRef();
				//create reference to video ellement
			}
			componentDidMount(){
				this.props.fetchStream(this.props.match.params.id);
			}
			render(){
				if (!this.props.stream) {
					return <div>Loading...</div>
				}
				const { title, description } = this.props.stream;
				return (
					<div>
						<video 
						//create video element return from react comp
							ref={this.videoRef} 
							//create a player a pass ref to video element to that player
							style={{width: '100%'}} 
							//changes width to 100%
							controls 
							//makes video controls viewable
						/>
						<h1>{title}</h1>
						<h5>{description}</h5>
					</div>
				);
			}
		}
		const mapStateToProps = (state, ownProps) => {
			const id = ownProps.match.params.id;
			return { stream: state.streams[id] };
		};
		export default connect(
			mapStateToProps, 
			{ fetchStream }
		)(StreamShow);
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating a FLV Player

	//We'll be setting up FLV in our StreamShow component
	//check https://github.com/illuspas/Node-Media-Server > via flv.js over websocket-flv

	//StreamShow.js:
		class StreamShow extends React.Component {
			constructor(props){
				super(props);
				this.videoRef = React.createRef();
			}
			//We should be writing this code for our player in CDM:
			componentDidMount(){
				const { id } = this.props.match.params.id;
				//extract out id to reuse
				this.props.fetchStream(id);
				//call fetchStream with our id var
				this.player = flv.createPlayer({
					type: 'fly',
					url: `http://localhost:8000/live/${id}.flv`
				});
				//set up video player and save as var
				this.players.attachMediaElement(this.videoRef.current);
				//we'll take ref to video element and pass it off to createPlayer():
					//this line of code appears to be throwing error
				this.player.load();
			}
		}
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Optional Player Building

	//current error: 'TypeError: Cannot read property 'attachMediaElement' of undefined'
	//solution: make sure we do not attempt to attach videoPlayer until we successfully get the stream

	//ShowStream.js:
		class StreamShow extends React.Component {
			constructor(props){
				super(props);
				this.videoRef = React.createRef();
			}
			componentDidMount(){
				const { id } = this.props.match.params;
				this.props.fetchStream(id);
				this.buildPlayer();
			}
			componentDidUpdate(){
				this.buildPlayer();
				//call buildplayer in componentDidUpdate(){}:
			}
			//create buildPlayer() method:
			buildPlayer(){
				if (this.player || !this.props.streams) {
					return;
					//return early if player exists or if there's no stream
				}
				const { id } = this.props.match.params;
				//move player set up logic to this method
				this.player = flv.createPlayer({
					type: 'fly',
					url: `http://localhost:8000/live/${id}.flv`
				});
				this.players.attachMediaElement(this.videoRef.current);
				this.player.load();
			render(){
				return (
					//some jsx
				);
			}
		}
	////////////////////////////////////////////////////////////////////////////////////////////////////




	////////////////////////////////////////////////////////////////////////////////////////////////////
	//It works!

		  
























