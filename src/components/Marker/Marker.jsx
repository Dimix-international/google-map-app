import {Marker} from "@react-google-maps/api";

export const MarkerMy = ({position}) => {
    return (
        <Marker
            position={position}
            icon={{
                url:'https://img1.picmix.com/output/stamp/thumb/0/4/3/9/1039340_a2a6b.gif'
            }}
            /*label={{
                text: 'You are here',
                fontSize: '18px',
            }}*/
        />
    )
}