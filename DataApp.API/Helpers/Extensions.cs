using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Reflection;
using DataApp.API.Models;

namespace DataApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, 
        int currentPage, int itemsPerPage, int totalItems, int totalPages) {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if(theDateTime.AddYears(age) > DateTime.Today)
            age--;
            return age;
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>
        (this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            HashSet<TKey> seenKeys = new HashSet<TKey>();
            foreach (TSource element in source) {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }

        // public static IQueryable<Message> DistinctByQuery<Message, T2>(this IQueryable<Message> source, Expression<Func<Message, T2>> predicate)
        // {
        //     var messageDistinct = (
        //         from m in source
        //         where m.Period == Period
        //         orderby m.MessageSent
        //         select m
        //     ).GroupBy(g => g.RecipientId).Select(x => x.FirstOrDefault());
        //     return messageDistinct;

        //     IQueryable<IGrouping<T2, Message>> group = source.GroupBy(predicate);
        //     IQueryable<Message> selected = group.Select(x => x.FirstOrDefault());
        //     return selected;

        //     return source.GroupBy(predicate).Select(x => x.FirstOrDefault());
        //     if (source == null)
        //         throw new ArgumentNullException(nameof(source));

        //     if (predicate == null)
        //         throw new ArgumentNullException(nameof(predicate));

        //     MethodInfo whereMethodInfo = GetMethodInfo<T>((s, p) => Queryable.Where(s, p));
        //     var callArguments = new[] { source.Expression, Expression.Quote(predicate) };
        //     var callToWhere = Expression.Call(null, whereMethodInfo, callArguments);

        //     return source.Provider.CreateQuery<T>(callToWhere);
        // }
    }
}