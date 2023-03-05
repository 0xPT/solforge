import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  Box,
  useRadio,
  useRadioGroup,
  Heading,
} from "@chakra-ui/react";
import zkSyncLogo from "@/assets/zksync.png";
import baseLogo from "@/assets/base.png";
import scrollLogo from "@/assets/scroll.png";
import polygonLogo from "@/assets/polygon.png";
import ethereumLogo from "@/assets/ethereum.png";
import Image from "next/image";

const optionToLogo: any = {
  "ethereum (l1)": ethereumLogo,
  "polygon (l1)": polygonLogo,
  "zksync era (l2)": zkSyncLogo,
  "base (l2)": baseLogo,
  "scroll (l2)": scrollLogo,
};

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w="full">
      <input {...input} />
      <Box
        w="full"
        display="flex"
        alignItems="center"
        {...checkbox}
        padding="14px 24px"
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
        cursor="pointer"
        borderRadius="8px"
        _checked={{
          bg: "rgba(30, 98, 255, 0.2)",
          color: "white",
          borderColor: "#1e62ff",
        }}
        _focus={{
          outline: "none",
        }}
        border="1px solid #34384e"
      >
        <Image
          alt="deploy"
          src={optionToLogo[props.value]}
          width={32}
          height={32}
          style={{ marginRight: "20px", height: 32, objectFit: "contain" }}
        />
        {props.children}
      </Box>
    </Box>
  );
}

export const DeployModal = ({
  isOpen,
  onClose,
  deployContract,
}: {
  isOpen: boolean;
  onClose: () => void;
  deployContract: () => Promise<void>;
}) => {
  const options = [
    "ethereum (l1)",
    "polygon (l1)",
    "zksync era (l2)",
    "base (l2)",
    "scroll (l2)",
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "",
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW="unset"
          backgroundColor="#242736"
          boxShadow="rgb(0 0 0 / 20%) 0px 0px 50px"
          width="600px"
          borderRadius="24px"
        >
          <Flex padding="32px">
            <VStack
              {...group}
              w="full"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
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
                Deploy contract
              </Heading>
              {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </VStack>
          </Flex>
          <Flex
            padding="32px"
            borderTop="1px solid #34384e"
            justifyContent="flex-end"
          >
            <Button
              onClick={() => deployContract()}
              boxShadow="rgb(0 0 0 / 10%) 0px 5px 10px"
              padding="14px 24px"
              fontWeight="500"
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="#fff"
              mt="1.5px"
              ml="0.75px"
              style={{
                fontFeatureSettings: "'ss02' on",
              }}
              borderRadius="8px"
              background={"#1e62ff"}
              _hover={{
                background: "rgba(30, 98, 255, 0.7)",
              }}
            >
              Deploy
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
