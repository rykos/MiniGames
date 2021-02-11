using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using MiniGames.Models;
using MiniGames.RockPaperScissors.Models;

namespace MiniGames.Hubs
{
    public class RockPaperScissorsHub : Hub<IRockPaperScissors>
    {
        public override async Task OnConnectedAsync()
        {
            User user = UserManager.GetUser(Context.UserIdentifier);
            if (user.GroupId != default)
            {
                Console.WriteLine($"{user.Name} connected");
                await Groups.AddToGroupAsync(Context.ConnectionId, user.GroupId);
            }
            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            User user = UserManager.GetUser(Context.UserIdentifier);
            if (user.GroupId != default)
            {
                Lobby lobby = LobbyHub.lobbies.FirstOrDefault(l => l.Id == user.GroupId);
                lobby.RemoveUser(user.Id);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task GetState()
        {
            RockPaperScissorsLobby lobby = (this.GetUserLobby() as RockPaperScissorsLobby);
            await Clients.Caller.UpdateGameState(lobby.GetState());
        }

        public async Task Use(string move)
        {
            if (move is not ("rock" or "paper" or "scissors"))
                return;

            string groupId = UserManager.GetUser(Context.UserIdentifier).GroupId;
            var lobby = LobbyHub.lobbies.FirstOrDefault(l => l.Id == groupId) as RockPaperScissorsLobby;
            lobby.Use(Context.UserIdentifier, move);
            await Clients.Group(groupId).Done(Context.UserIdentifier);
            if (lobby.GameIsFinished())
                await Clients.Group(groupId).Reveal(lobby.GetActions());
        }
        
        private Lobby GetUserLobby()
        {
            User user = UserManager.GetUser(Context.UserIdentifier);
            if (user == default)
                return null;
            return LobbyHub.lobbies.FirstOrDefault(l => l.Id == user.GroupId);
        }
    }

    public interface IRockPaperScissors
    {
        //User performed his action
        Task Done(string userId);
        //Reveals all used actions to players
        Task Reveal(RockPaperScissors.Models.Action[] actions);
        //Signalizes that new round has started
        Task StartRound();
        Task UpdateGameState(GameState gameState);
    }
}