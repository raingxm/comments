var HelloWorld = React.createClass({
    render: function() {
        return (
            <p>Hello, please input your name here:
                <input type="text" placeholder="your name" /> !
                It is {this.props.date.toTimeString()}.
            </p>);
    }
});

setInterval(function() {
    React.render(<HelloWorld date={new Date()} />, document.getElementById('content'));
}, 500);