interface ExpectedUser {
    email: string,
    name: string,
    title: string,
    birth_date: string,
    birth_month: string,
    birth_year: string,
    firstname: string,
    lastname: string,
    company: string,
    address1: string,
    address2: string,
    country: string,
    state: string,
    city: string,
    zipcode: string
};

export function getExpectedUser(account: ExpectedUser) {
    return {
        name: account.name,
        email: account.email,
        title: account.title,
        birth_day: account.birth_date,
        birth_month: account.birth_month,
        birth_year: account.birth_year,
        first_name: account.firstname,
        last_name: account.lastname,
        company: account.company,
        address1: account.address1,
        address2: account.address2,
        country: account.country,
        state: account.state,
        city: account.city,
        zipcode: account.zipcode
    };
}