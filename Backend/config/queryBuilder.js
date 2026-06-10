export function buildQuestionQuery(query) {
  const {
    page = 1,
    limit = 10,
    search,
    sort = "latest",
    tag,
    status
  } = query;

  const where = {};

  // 🔎 SEARCH (title search)
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive"
    };
  }

  // 🏷 FILTER BY TAG
  if (tag) {
    where.questionTags = {
      some: {
        tag: {
          name: tag.toLowerCase().trim()
        }
      }
    };
  }

  // 📌 FILTER BY STATUS
  if (status === "answered") {
    where.acceptedAnswerId = { not: null };
  }

  if (status === "unanswered") {
    where.acceptedAnswerId = null;
  }

  // 📊 SORTING
  let orderBy = {};

  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;

    case "latest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // 📄 PAGINATION
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  return {
    where,
    orderBy,
    skip,
    take
  };
}

export function buildAnswerQuery(query){
  const {
    page = 1,
    limit = 10,
    sort = "latest"
  } = query;

  let orderBy = {};

  switch(sort){
    case "oldest":
      orderBy = {createdAt: "asc"};
      break;
    
    case "latest":
    default:
      orderBy = {createdAt: "desc"};
      break;
  }

  const take = Number(limit);
  const skip = Number(page - 1) * take;

  return {
    orderBy,
    skip,
    take
  }

}


export function buildCommentQuery(query){
  const {
    page = 1,
    limit = 10,
    sort = "latest"
  } = query;

  let orderBy = {};

  switch(sort){
    case "oldest":
      orderBy = {createdAt: "asc"};
      break;
    
    case "latest":
      orderBy = {createdAt: "desc"};
      break;
  }

  const take = Number(limit);
  const skip = (Number(page)-1) * take; 

  return {
    orderBy,
    skip,
    take
  }
}
