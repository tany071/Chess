import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, MOVE } from "./messages";


export class Game {
    private player1 : WebSocket;
    private player2 : WebSocket;
    private board : Chess;
    private moves : string[];
    private startTime : Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
    }

    maakeMove(socket: WebSocket , move: {
        from: string;
        to: string;
    }){
        //validate message type with zod
        if (this.board.moves.length % 2 === 0 && socket !== this.player1){
            return 
        }
        if (this.board.moves.length % 2 === 1 && socket !== this.player2){
            return
        }

        try{
            this.board.move(move);
        } catch(e){

        }

        if (this.board.isGameOver()){
            //Send a game over message to both players 
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return;
        }

        if(this.board.moves.length % 2 === 0){
            this.player2.emit(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            this.player1.emit(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }

    }
}