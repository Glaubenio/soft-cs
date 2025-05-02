import { getDocuments } from "@/actions/documents/get-documents";
import Container from "../components/ui/Container";
import ModalDropzone from "./components/modal-dropzone";
import { Documents } from "@prisma/client";
import FileUploader from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";

const DocumentsPage = async () => {
  const documents: Documents[] = await getDocuments();

  return (
    <Container
      title="Documentos"
      description={"Everything you need to know about company documents"}
    >
      <div>
        <Button>
          Upload
        </Button>
      </div>


    </Container>
  );
};

export default DocumentsPage;
