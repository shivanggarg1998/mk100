export default html = (<div className="container_80">
    <div style={{position: "relative"}}>
        <Input.TextArea rows={7}
                        placeholder="Add Post Here .... "/>{" "}
        <Button
            style={{
                position: "absolute",
                bottom: "10px",
                right: "10px"
            }}
            type="primary"
            shape="circle"
        >
            {" "}
            <i className="fa fa-send-o"/>
        </Button>

        <Button
            style={{
                position: "absolute",
                bottom: "10px",
                left: "10px"
            }}
        >
            <Icon type="upload"/> Upload
        </Button>

    </div>
</div>);
