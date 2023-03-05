import {
  Modal,
  ModalOverlay,
  Heading,
  ModalContent,
  Flex,
  Textarea,
} from "@chakra-ui/react";

export const SrcCodeModal = ({
  source,
  isOpen,
  onClose,
}: {
  source: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent
        maxW="unset"
        backgroundColor="#242736"
        boxShadow="rgb(0 0 0 / 20%) 0px 0px 50px"
        width="600px"
        borderRadius="24px"
      >
        <Flex padding="32px" direction="column">
          <Heading
            fontWeight="500"
            fontSize="12px"
            textTransform="uppercase"
            letterSpacing="0.1em"
            color="#fff"
            mt="1.5px"
            ml="0.75px"
            style={{
              fontFeatureSettings: "'ss02' on",
            }}
            mb="24px"
          >
            View Source Code
          </Heading>

          <Textarea minH="70vh">{source}</Textarea>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
