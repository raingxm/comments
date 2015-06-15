var Comment = React.createClass({
    render: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author}>{comment.text}</Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if(!author || !text) {
            return;
        }

        this.props.onSubmitComment({author: author, text: text});
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type='text' placeholder='your name' ref='author' /><br/>
                <input type='text' placeholder='comment here' ref='text' /><br/>
                <input type='submit' value='post' />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    loadDataFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'GET',
            cached: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, error) {
                console.error(this.props.url, status, error.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat(comment);
        this.setState(newComments);

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, error) {
                console.error(this.props.url, status, error.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadDataFromServer();
        setInterval(this.loadDataFromServer, this.props.syncInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <hr/>
                <CommentForm onSubmitComment={this.handleSubmit} />
            </div>
        );
    }
});

React.render(<CommentBox url='comments.json' syncInterval={2000} />,
    document.getElementById('content'));

