package application.bluemix;

public abstract class BluemixCredentials {

    protected String sanitiseString(String data) throws InvalidCredentialsException {
        if (data == null || data.isEmpty()) {
            throw new InvalidCredentialsException("Invalid string.");
        }
        char first = data.charAt(0);
        char last = data.charAt(data.length() - 1);
        if ((first == '"' || first == '\'') && (first == last)) {
            return data.substring(1, data.length() - 1);
        }
        return data;
    }

}
