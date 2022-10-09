//we need a function to enter the lottery
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrace() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis(); //moralis weet welke chainId we momenteel op zitten
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setnumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("");
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const dispatch = useNotification();
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    //enterRaffle is onze functie uit contract
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee, //
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    //enterRaffle is onze functie uit
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    //enterRaffle is onze functie uit
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    //enterRaffle is onze functie uit
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    setEntranceFee(entranceFeeFromCall);
    const numPlayersFromCall = (await getNumberOfPlayers()).toString();
    setnumPlayers(numPlayersFromCall);
    const recentWinnerFromCall = await getRecentWinner();
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]); //try to read the entrance fee

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = function () {
    dispatch({
      //zie web3uikit docs!
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
    });
  };
  return (
    <div>
      Hi from Raffle Entrance
      {raffleAddress ? (
        <div className="">
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
          </div>
          <div>Number of Players in the contract: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle address detected</div>
      )}
    </div>
  );
}
