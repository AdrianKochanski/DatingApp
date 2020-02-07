using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataApp.API.Data;
using DataApp.API.Models;
using DataApp.API.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace DataApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;
        private readonly IConfiguration _config;
        public AuthController(
            IAuthRepository authRepo,
            IConfiguration config){
            _authRepo = authRepo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(/*[FromBody]*/UserForRegisterDto user) {
            
            // if(!ModelState.IsValid)
            //     return BadRequest(ModelState);

            user.Username = user.Username.ToLower();
            if( await _authRepo.UserExists(user.Username))
                return BadRequest("Username already exist");

            var userTocreate = new User
            {
                Username = user.Username
            };

            var createdUser = await _authRepo.Register(userTocreate, user.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForloginDto){
            
            //throw new Exception("Computer say no!");

            var userFromRepo = await _authRepo.Login(
                userForloginDto.Username.ToLower(), 
                userForloginDto.Password);

            if(userFromRepo == null)
            return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _config.GetSection("AppSettings:Token").Value
            ));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new  SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}