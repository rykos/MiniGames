using System;
using System.Collections.Generic;
using System.Linq;
using MiniGames.Hubs;

namespace MiniGames.Models
{
    public class Lobby
    {
        public Lobby(string id, string name, string game, int players, int playersMax, string creatorId, LobbyHub.LobbyChange lobbyChange)
        {
            this.Id = id;
            this.Name = name;
            this.Game = game;
            this.Players = players;
            this.PlayersMax = playersMax;
            this.CreatorId = creatorId;
            this.lobbyChange = lobbyChange;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Game { get; set; }
        public int Players { get; set; }
        public int PlayersMax { get; set; }
        public string CreatorId { get; set; }

        public List<User> users = new List<User>();
        private LobbyHub.LobbyChange lobbyChange;

        public virtual bool AddUser(string userid)
        {
            if (this.Players >= this.PlayersMax)
                return false;
            this.Players++;
            this.users.Add(UserManager.GetUser(userid));
            UserManager.UserSetGroup(userid, this.Id);
            this.lobbyChange?.Invoke(this.Id, this.Players);
            return true;
        }

        public virtual void RemoveUser(string userid)
        {
            User user = this.users.FirstOrDefault(u => u.Id == userid);
            if (user == default)
                return;
            this.users.Remove(user);
            this.Players--;
            this.lobbyChange?.Invoke(this.Id, this.Players);
            //Destroy empty lobby
            if (this.Players <= 0)
                LobbyHub.lobbies.Remove(this);
        }

        public object DTO()
        {
            return new
            {
                this.Id,
                this.Name,
                this.Game,
                this.Players,
                this.PlayersMax
            };
        }
    }
}