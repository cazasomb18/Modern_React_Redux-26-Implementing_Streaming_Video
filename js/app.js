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

	//We're going to want to make a class-based component X
	//going to attempt to look at url
	//find id in side there
	//fetch stream
	//get stream out of redux store
	//show it inside render()