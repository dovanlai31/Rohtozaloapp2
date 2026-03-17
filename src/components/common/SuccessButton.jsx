import { Button } from "zmp-framework/react"

const SuccessButton = ({
    title = "",
    icon = "",
    styles = {},
    onClick = () => {},
    typeName = "secondary"
}) => {
    return(
        <Button 
            iconZMP={icon} 
            iconSize={17}
            type="button" 
            typeName={typeName}
            style={{ 
                textAlign: "end", 
                height: 50, 
                width: 220, 
                alignSelf: "center", 
                justifySelf: "end", 
                borderColor: "#5cbf0a", 
                borderWidth: 2, 
                color: "#5cbf0a", 
                background: "#fff",
                fontSize: 14,
                ...styles 
            }} 
            onClick={onClick}
        >
            <span style={{marginTop: 4, fontSize: 17}}>{title}</span>
        </Button>
    )
}

export default SuccessButton