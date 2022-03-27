import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import {Badge, Box, SimpleGrid, Spinner} from '@chakra-ui/react';
import {
  ConsolidatorReturnType,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import SvgResourceComposer from '../components/rmrk-svg-composer';

export const fetchData = async (setNfts: (nfts: NFTConsolidated[]) => void) => {
  try {
    const payload = await fetch('/substra-dump.json');
    const data: ConsolidatorReturnType = await payload.json();
    if (data?.nfts) {
      setNfts(Object.values(data.nfts));
    }
    console.log(data);
  } catch (error: any) {
    console.log(error);
  }
};

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NFTConsolidated[]>([]);
  useEffect(() => {
    fetchData(setNfts);
  }, []);

  if (!nfts) {
    return <Spinner size="xl" />;
  }

  console.log(nfts)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={6}>
        <SimpleGrid columns={[2, 4]} spacing={4}>
          {nfts.filter(nft => nft.collection === 'd43593c715a56da27d-CHNK').map((nft, index) => (
            <Box key={nft.id} minW={400} borderWidth={1} borderColor={'white'} borderStyle={'solid'} borderRadius={10} backgroundColor={index % 2 ? 'blue.500' : 'yellow.500'} position={'relative'}>
              <Badge position={'absolute'} top={4} right={4} colorScheme={'gray.600'}>{nft.sn.slice(nft.sn.length - 4)}</Badge>
              <SvgResourceComposer nft={nft} />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default Home;
