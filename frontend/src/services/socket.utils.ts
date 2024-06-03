import ReactQuill from "react-quill";
import { MessageVariant } from "./socket.constants";
import { DeltaStatic } from '../../node_modules/react-quill/node_modules/@types/quill/index';

export function handleSocketMessage(message: MessageEvent<any>, quillRef: React.RefObject<ReactQuill>) {
    const message_JSON = JSON.parse(message.data);

    switch(message_JSON.variant) {

        case MessageVariant.Document:
            quillRef.current?.editor?.setText(message_JSON.content);
            break;

        case MessageVariant.Delta:
            const delta: DeltaStatic = JSON.parse(message_JSON.content);
            quillRef.current?.editor?.updateContents(delta, "api");
            break;

        case MessageVariant.Error:
            console.log("Internal Server Error");
            break;
    }
}