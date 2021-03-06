package test;

import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import model.User;
import test.facade.LoginStepsFacade;
import utils.DataConstants;

public class SignUpStepsIT extends BaseSteps {

	@Test(dataProvider = "new_user_data", priority = 4, retryAnalyzer = utils.RetryAnalizer.class)
	public void singUpToBigNeon(User user) {
		LoginStepsFacade loginFacade = new LoginStepsFacade(driver);
		maximizeWindow();
		loginFacade.givenUserIsOnLoginPage();
		loginFacade.whenUserClicksOnRegisterLink();
		loginFacade.whenUserEntersRegistrationDataAndClicksOnCreateAccount(user);
		boolean retVal = loginFacade.thenUserShouldBeOnHomePage();
		loginFacade.logOut();
		Assert.assertTrue(retVal);
	}
	
	@Test(dataProvider = "predifined_user_data", priority = 4, retryAnalyzer = utils.RetryAnalizer.class)
	public void signUpPredifinedUsers(User user) {
		LoginStepsFacade loginFacade = new LoginStepsFacade(driver);
		maximizeWindow();
		boolean isLoggedIn = loginFacade.whenUserTiesToLogin(user);
		if (!isLoggedIn) {
			loginFacade.givenUserIsOnLoginPage();
			loginFacade.whenUserClicksOnRegisterLink();
			loginFacade.whenUserEntersRegistrationDataAndClicksOnCreateAccount(user);
			boolean isRegistered = loginFacade.thenUserShouldBeOnHomePage();
			
			Assert.assertTrue(isRegistered);
		} 
		loginFacade.logOut();
	}

	@DataProvider(name = "new_user_data")
	public static Object[][] dataProvider() {
		User user = User.generateRandomUser();
		return new Object[][] {{user}};
	}
	
	@DataProvider(name = "predifined_user_data")
	public static Object[][] predifinedUsersDataProvider() {
		User userOne = User.generateUserFromJson(DataConstants.DISTINCT_USER_ONE_KEY);
		User userTwo = User.generateUserFromJson(DataConstants.DISTINCT_USER_TWO_KEY);
		User userThree = User.generateUserFromJson(DataConstants.DISTINCT_USER_THREE_KEY);
		
		return new Object[][] {
			{userOne},
			{userTwo},
			{userThree}};
		
	}

}
