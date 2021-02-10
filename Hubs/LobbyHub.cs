using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MiniGames.Models;
using MiniGames.RockPaperScissors.Models;

namespace MiniGames.Hubs
{
    public class LobbyHub : Hub<ILobbyHub>
    {
        public delegate void LobbyChange(string lobbyId, int playerCount);
        public event LobbyChange LobbyChanged;

        public static List<Lobby> lobbies = new();

        public LobbyHub()
        {
            if (LobbyChanged == null)
            {
                LobbyChanged += (string lobbyId, int players) =>
                {
                    Console.WriteLine($"{lobbyId} with {players}");
                    Clients.All.UpdateLobby(lobbyId, players);
                };
            }
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"{Context.UserIdentifier} connected");
            UserManager.UserInit(Context.UserIdentifier);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"{Context.UserIdentifier} disconnected");
            return base.OnDisconnectedAsync(exception);
        }

        public Task RefreshLobbys()
        {
            return this.Clients.Caller.ReceiveLobbies(LobbyHub.lobbies);
        }

        public async Task CreateLobby(string name, string mode, int maxPlayers, bool publicLobby)
        {
            if(maxPlayers < 2){
                return;
            }
            if (mode == "R&P&S")
            {
                Lobby lobby = new RockPaperScissorsLobby(Guid.NewGuid().ToString(), name, mode, 0, maxPlayers, Context.UserIdentifier, this.LobbyChanged);
                lobby.AddUser(Context.UserIdentifier);
                LobbyHub.lobbies.Add(lobby);
                await this.Clients.Caller.MoveToLobby(lobby.Id, mode);
                await this.Clients.AllExcept(Context.ConnectionId).ReceiveLobby(lobby);
            }
            else
            {
                throw new Exception();
            }
        }

        public async Task JoinLobby(string lobbyId)
        {
            Lobby lobby = lobbies.FirstOrDefault(l => l.Id == lobbyId);
            if (lobby == default)
                return;

            bool success = lobby.AddUser(Context.UserIdentifier);
            if (success)
                await this.Clients.Caller.MoveToLobby(lobby.Id, lobby.Game);
        }
    }

    public interface ILobbyHub
    {
        Task MoveToLobby(string lobbyId, string moge);
        Task ReceiveLobbies(List<Lobby> lobbies);
        Task ReceiveLobby(Lobby lobby);
        Task UpdateLobby(string lobbyId, int players);
        Task RemoveLobby(string id);
        Task ReceiveMessage(string msg);
    }
}