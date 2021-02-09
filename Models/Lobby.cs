using System;
using System.Collections.Generic;
using System.Linq;
using MiniGames.Hubs;

namespace MiniGames.Models
{
    public class Lobby
    {
        public Lobby(string id, string name, string game, int players, int playersMax, LobbyHub.LobbyChange lobbyChange)
        {
            Id = id;
            Name = name;
            Game = game;
            Players = players;
            PlayersMax = playersMax;
            this.lobbyChange = lobbyChange;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Game { get; set; }
        public int Players { get; set; }
        public int PlayersMax { get; set; }

        public List<string> users = new List<string>();
        private LobbyHub.LobbyChange lobbyChange;

        public virtual bool AddUser(string userid)
        {
            if (this.Players >= this.PlayersMax)
                return false;
            this.Players++;
            this.users.Add(userid);
            UserManager.UserSetGroup(userid, this.Id);
            this.lobbyChange?.Invoke(this.Id, this.Players);
            return true;
        }

        public virtual void RemoveUser(string userid)
        {
            this.Players--;
            this.users.Remove(userid);
            this.lobbyChange?.Invoke(this.Id, this.Players);
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