
import './Overlay.css'

export interface IOverlayProps {
    imageSrc: string;
    onClose: () => void;
}

export default function Overlay (props: IOverlayProps) {
    return (
        <div className="overlay" onClick={props.onClose}>
          <img className="overlay-image" src={props.imageSrc} alt="overlay" />
        </div>
      );
}
